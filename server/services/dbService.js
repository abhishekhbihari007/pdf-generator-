const mysql = require('mysql2/promise');
require('dotenv').config();

class DatabaseService {
  constructor() {
    this.pool = null;
    this.initializePool();
  }

  /**
   * Initialize database connection pool
   */
  initializePool() {
    if (process.env.DB_HOST) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
  }

  /**
   * Fetch data from database
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   */
  async fetchData(query, params = []) {
    if (!this.pool) {
      throw new Error('Database not configured. Please set DB environment variables.');
    }

    try {
      const [rows] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  /**
   * Fetch worksheet data by ID
   * @param {string} worksheetId - Worksheet identifier
   */
  async fetchWorksheetData(worksheetId) {
    // Example query structure - adjust based on your database schema
    const query = `
      SELECT 
        w.id,
        w.school_name,
        w.class_name,
        w.worksheet_id,
        w.date,
        w.score,
        s.section_type,
        s.section_title,
        s.section_data
      FROM worksheets w
      LEFT JOIN worksheet_sections s ON w.id = s.worksheet_id
      WHERE w.worksheet_id = ?
      ORDER BY s.section_order
    `;

    return await this.fetchData(query, [worksheetId]);
  }

  /**
   * Test database connection
   */
  async testConnection() {
    if (!this.pool) {
      return { connected: false, message: 'Database not configured' };
    }

    try {
      const [rows] = await this.pool.execute('SELECT 1 as test');
      return { connected: true, message: 'Database connection successful' };
    } catch (error) {
      return { connected: false, message: error.message };
    }
  }
}

module.exports = new DatabaseService();

