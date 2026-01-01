const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'worksheets.db');
  }

  /**
   * Initialize database connection and create tables
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
          return;
        }
        console.log('Connected to SQLite database');
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  /**
   * Create worksheets table
   */
  async createTables() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS worksheets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          header_info TEXT NOT NULL,
          html_content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.run(createTableSQL, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          reject(err);
          return;
        }
        console.log('Worksheets table created/verified');
        resolve();
      });
    });
  }

  /**
   * Get all worksheets
   */
  async getAllWorksheets() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, title, header_info, created_at, updated_at FROM worksheets ORDER BY created_at DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  /**
   * Get worksheet by ID
   */
  async getWorksheetById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM worksheets WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  /**
   * Create new worksheet
   */
  async createWorksheet(title, headerInfo, htmlContent) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO worksheets (title, header_info, html_content, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `;
      
      const headerInfoJSON = typeof headerInfo === 'string' ? headerInfo : JSON.stringify(headerInfo);
      
      this.db.run(sql, [title, headerInfoJSON, htmlContent], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, title, headerInfo, htmlContent });
      });
    });
  }

  /**
   * Update worksheet
   */
  async updateWorksheet(id, title, headerInfo, htmlContent) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE worksheets 
        SET title = ?, header_info = ?, html_content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const headerInfoJSON = typeof headerInfo === 'string' ? headerInfo : JSON.stringify(headerInfo);
      
      this.db.run(sql, [title, headerInfoJSON, htmlContent, id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id, title, headerInfo, htmlContent });
      });
    });
  }

  /**
   * Delete worksheet
   */
  async deleteWorksheet(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM worksheets WHERE id = ?`;
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ deleted: this.changes > 0 });
      });
    });
  }

  /**
   * Close database connection
   */
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log('Database connection closed');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = new Database();

