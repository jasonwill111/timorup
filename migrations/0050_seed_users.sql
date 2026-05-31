-- Seed Users for Testing - Using OR IGNORE for existing emails
INSERT OR IGNORE INTO user (id, email, name, role, emailVerified, phone, createdAt, updatedAt) VALUES
('admin-001', 'admin@timorup.com', 'Admin User', 'admin', 1, '+670 7700 0001', 1717000000, 1717000000),
('user-001', 'user1@timorup.com', 'John Smith', 'user', 1, '+670 7721 1001', 1717000000, 1717000000),
('user-002', 'user2@timorup.com', 'Maria Santos', 'user', 1, '+670 7722 2002', 1717000000, 1717000000),
('user-003', 'user3@timorup.com', 'Carlos Soares', 'user', 1, '+670 7723 3003', 1717000000, 1717000000),
('user-004', 'user4@timorup.com', 'Ana Fatima', 'user', 1, '+670 7724 4004', 1717000000, 1717000000),
('user-005', 'user5@timorup.com', 'Jose Silva', 'user', 1, '+670 7725 5005', 1717000000, 1717000000),
('user-006', 'user6@timorup.com', 'Lisa Monica', 'user', 1, '+670 7726 6006', 1717000000, 1717000000),
('user-007', 'user7@timorup.com', 'Pedro Costa', 'user', 1, '+670 7727 7007', 1717000000, 1717000000),
('user-008', 'user8@timorup.com', 'Rosa Lima', 'user', 1, '+670 7728 8008', 1717000000, 1717000000),
('user-009', 'user9@timorup.com', 'Manuel Cruz', 'user', 1, '+670 7729 9009', 1717000000, 1717000000),
('user-010', 'user10@timorup.com', 'Julia Pereira', 'user', 1, '+670 7720 1010', 1717000000, 1717000000),
('user-011', 'user11@timorup.com', 'Antonio Belo', 'user', 1, '+670 7721 2011', 1717000000, 1717000000),
('user-012', 'user12@timorup.com', 'Teresa Hornay', 'user', 1, '+670 7722 3012', 1717000000, 1717000000);
