-- Users Seed Data (适配远程表结构)
-- TimorUp 2026-05-21

-- Admin users
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-admin-1', 'admin@timorup.tl', '77000001', 'Admin User', NULL, 'admin', 1700000000, 1750000000);

-- Business owners
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-1', 'joao.silva@email.tl', '77001234', 'João Silva', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-2', 'nazar.santos@email.tl', '77002345', 'Nazar Santos', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-3', 'maria.belo@email.tl', '77003456', 'Maria Belo', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-4', 'maria.reis@email.tl', '77005678', 'Maria Reis', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-5', 'francisco.soares@email.tl', '77006789', 'Francisco Soares', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-6', 'carlos.almeida@email.tl', '77009999', 'Carlos Almeida', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-7', 'rui.fernandes@email.tl', '77001234', 'Rui Fernandes', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-8', 'dr.pedro.santos@email.tl', '77007890', 'Dr. Pedro Santos', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-9', 'ana.lima@email.tl', '77004567', 'Ana Lima', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-10', 'paulo.gusmao@email.tl', '77005678', 'Paulo Gusmão', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-11', 'susan.brown@email.tl', '77009876', 'Susan Brown', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-12', 'maria.oliveira@email.tl', '77002345', 'Maria Oliveira', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-13', 'joaquim.santos@email.tl', '77007890', 'Joaquim Santos', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-14', 'manager@shell.tl', '77001111', 'Shell Manager', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-15', 'manuel.dacosta@email.tl', '77009999', 'Manuel da Costa', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-16', 'rosa.fernandes@email.tl', '77003456', 'Rosa Fernandes', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-17', 'director@bancatimu.tl', '77001122', 'Banca Director', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('owner-18', 'antonio@aquatimor.tl', '77009988', 'Antonio til', NULL, 'user', 1700000000, 1750000000);

-- NGO admins
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-1', 'dr.dan.silva@hbp-tl.org', '77001234', 'Dr. Dan Silva', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-2', 'dr.joanita@maluktimor.org', '77002345', 'Dr. Joanita', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-3', 'ana.belo@fundasauncheira.tl', '77003456', 'Ana Belo', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-4', 'fr.jose@passaredo.org', '77004567', 'Fr. Jose', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-5', 'rui.oliveira@birds-tl.org', '77005678', 'Rui Oliveira', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-6', 'luis.dacosta@fundasaunjgomes.tl', '77006789', 'Luis da Costa', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-7', 'maria.ximenes@fetufoin.tl', '77007890', 'Maria Ximenes', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-8', 'paulo.gusmao@moris.fuin.tl', '77008901', 'Paulo Gusmao', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-9', 'tomas.soares@habilitas.tl', '77009012', 'Tomas Soares', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('ngo-admin-10', 'fernanda@kdadatak.tl', '77000123', 'Fernanda til', NULL, 'user', 1700000000, 1750000000);

-- Government admins
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-1', 'servico@mof.gov.tl', '77001000', 'Ministry Finance', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-2', 'geral@ms.gov.tl', '77002000', 'Ministry Health', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-3', 'geral@me.gov.tl', '77003000', 'Ministry Education', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-4', 'estasaun@pntl.gov.tl', '77003333', 'PNTL Central', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-5', 'coord@protecaocivil.gov.tl', '77003334', 'Civil Protection', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-6', 'recepcao@migracao.gov.tl', '77003335', 'Migration Service', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-7', 'geral@mj.gov.tl', '77004000', 'Ministry Justice', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-8', 'atendimento@srt.gov.tl', '77005555', 'Tax Revenue', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-9', 'emprego@gov.tl', '77006666', 'Employment Service', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('gov-admin-10', 'gabinete@cmdili.gov.tl', '77007777', 'Dili Municipal', NULL, 'user', 1700000000, 1750000000);

-- Regular users (listing owners)
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-1', 'maria.santos@email.tl', '77001111', 'Maria Santos', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-2', 'carlos.til@email.tl', '77002222', 'Carlos til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-3', 'joaquim.til@email.tl', '77003333', 'Joaquim til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-4', 'ana.til@email.tl', '77004444', 'Ana til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-5', 'hr@ngotl.org', '77005555', 'HR til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-6', 'rui.til@email.tl', '77006666', 'Rui til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-7', 'paulo.til@email.tl', '77007777', 'Paulo til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-8', 'luis.til@email.tl', '77008888', 'Luis til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-9', 'manuel.til@email.tl', '77009999', 'Manuel til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-10', 'joao.til@email.tl', '77001010', 'Joao til', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-11', 'user11@email.tl', '77001212', 'User 11', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-12', 'user12@email.tl', '77001313', 'User 12', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-13', 'user13@email.tl', '77001414', 'User 13', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-14', 'user14@email.tl', '77001515', 'User 14', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-15', 'user15@email.tl', '77001616', 'User 15', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-16', 'user16@email.tl', '77001717', 'User 16', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-17', 'user17@email.tl', '77001818', 'User 17', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-18', 'user18@email.tl', '77001919', 'User 18', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-19', 'user19@email.tl', '77002020', 'User 19', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-20', 'user20@email.tl', '77002121', 'User 20', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-21', 'user21@email.tl', '77002222', 'User 21', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-22', 'user22@email.tl', '77002323', 'User 22', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-23', 'user23@email.tl', '77002424', 'User 23', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-24', 'user24@email.tl', '77002525', 'User 24', NULL, 'user', 1700000000, 1750000000);
INSERT INTO users (id, email, phone, name, image, role, created_at, updated_at) VALUES ('user-25', 'user25@email.tl', '77002626', 'User 25', NULL, 'user', 1700000000, 1750000000);