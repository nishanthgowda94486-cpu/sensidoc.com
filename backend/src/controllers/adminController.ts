import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { supabase } from '@/config/database';
import { ApiResponse } from '@/types';
import { AuthRequest } from '@/middleware/auth';

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       403:
 *         description: Admin access required
 */
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get various statistics
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      verifiedDoctors,
      unverifiedUsers,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      totalDiagnoses,
      totalDrugAnalyses,
      premiumUsers,
      recentLogins
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact' }).eq('role', 'doctor'),
      supabase.from('users').select('id', { count: 'exact' }).eq('role', 'patient'),
      supabase.from('doctors').select('id', { count: 'exact' }).eq('is_verified', true),
      supabase.from('users').select('id', { count: 'exact' }).eq('is_verified', false),
      supabase.from('appointments').select('id', { count: 'exact' }),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'completed'),
      supabase.from('appointments').select('id', { count: 'exact' }).in('status', ['cancelled', 'rejected']),
      supabase.from('diagnosis').select('id', { count: 'exact' }),
      supabase.from('drug_analysis').select('id', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact' }).eq('membership_type', 'premium'),
      supabase
        .from('login_logs')
        .select('id', { count: 'exact' })
        .gte('login_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Get monthly growth data
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);

    const [currentMonthUsers, lastMonthUsers] = await Promise.all([
      supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gte('created_at', `${currentMonth}-01`)
        .lt('created_at', `${currentMonth}-32`),
      supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gte('created_at', `${lastMonth}-01`)
        .lt('created_at', `${lastMonth}-32`)
    ]);

    const userGrowth = ((currentMonthUsers.count || 0) - (lastMonthUsers.count || 0)) / Math.max(lastMonthUsers.count || 1, 1) * 100;

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        users: {
          total: totalUsers.count || 0,
          doctors: totalDoctors.count || 0,
          patients: totalPatients.count || 0,
          unverified: unverifiedUsers.count || 0,
          premium: premiumUsers.count || 0,
          growth: Math.round(userGrowth * 100) / 100
        },
        doctors: {
          total: totalDoctors.count || 0,
          verified: verifiedDoctors.count || 0,
          unverified: (totalDoctors.count || 0) - (verifiedDoctors.count || 0)
        },
        appointments: {
          total: totalAppointments.count || 0,
          pending: pendingAppointments.count || 0,
          completed: completedAppointments.count || 0,
          cancelled: cancelledAppointments.count || 0
        },
        aiServices: {
          totalDiagnoses: totalDiagnoses.count || 0,
          totalDrugAnalyses: totalDrugAnalyses.count || 0
        },
        activity: {
          recentLogins: recentLogins.count || 0
        }
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with filters
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [patient, doctor, admin]
 *       - in: query
 *         name: is_verified
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: membership_type
 *         schema:
 *           type: string
 *           enum: [free, premium]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      role, 
      is_verified, 
      membership_type, 
      search, 
      page = 1, 
      limit = 20 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('users')
      .select('id, email, full_name, phone, role, is_verified, membership_type, created_at, updated_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (role) {
      query = query.eq('role', role);
    }

    if (is_verified !== undefined) {
      query = query.eq('is_verified', is_verified === 'true');
    }

    if (membership_type) {
      query = query.eq('membership_type', membership_type);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / Number(limit));

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * @swagger
 * /api/admin/doctors:
 *   get:
 *     summary: Get all doctors with details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_verified
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 */
export const getDoctors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      is_verified, 
      specialization, 
      city, 
      page = 1, 
      limit = 20 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('doctors')
      .select(`
        *,
        users!doctors_user_id_fkey(id, full_name, email, phone, is_verified, created_at)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (is_verified !== undefined) {
      query = query.eq('is_verified', is_verified === 'true');
    }

    if (specialization) {
      query = query.ilike('specialization', `%${specialization}%`);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const { data: doctors, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / Number(limit));

    res.json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * @swagger
 * /api/admin/doctors/{doctorId}/verify:
 *   put:
 *     summary: Verify or unverify a doctor
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_verified
 *             properties:
 *               is_verified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Doctor verification status updated
 */
export const verifyDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;
    const { is_verified } = req.body;

    const { error } = await supabase
      .from('doctors')
      .update({ 
        is_verified,
        updated_at: new Date().toISOString()
      })
      .eq('id', doctorId);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: `Doctor ${is_verified ? 'verified' : 'unverified'} successfully`
    } as ApiResponse);

  } catch (error) {
    console.error('Verify doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * @swagger
 * /api/admin/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled, rejected]
 *       - in: query
 *         name: consultation_type
 *         schema:
 *           type: string
 *           enum: [chat, video, visit]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      status, 
      consultation_type, 
      page = 1, 
      limit = 20 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, full_name, email),
        doctor:doctors!appointments_doctor_id_fkey(
          id,
          specialization,
          users!doctors_user_id_fkey(full_name, email)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (consultation_type) {
      query = query.eq('consultation_type', consultation_type);
    }

    const { data: appointments, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / Number(limit));

    res.json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: appointments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * @swagger
 * /api/admin/login-logs:
 *   get:
 *     summary: Get login analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [patient, doctor, admin]
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Login logs retrieved successfully
 */
export const getLoginLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      role, 
      days = 30, 
      page = 1, 
      limit = 50 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const startDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString();

    let query = supabase
      .from('login_logs')
      .select(`
        *,
        users!login_logs_user_id_fkey(full_name, email)
      `)
      .gte('login_timestamp', startDate)
      .order('login_timestamp', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (role) {
      query = query.eq('role', role);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / Number(limit));

    res.json({
      success: true,
      message: 'Login logs retrieved successfully',
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get login logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

/**
 * @swagger
 * /api/admin/users/{userId}/membership:
 *   put:
 *     summary: Update user membership type
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - membership_type
 *             properties:
 *               membership_type:
 *                 type: string
 *                 enum: [free, premium]
 *     responses:
 *       200:
 *         description: Membership updated successfully
 */
export const updateUserMembership = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { membership_type } = req.body;

    const { error } = await supabase
      .from('users')
      .update({ 
        membership_type,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'User membership updated successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Update user membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};