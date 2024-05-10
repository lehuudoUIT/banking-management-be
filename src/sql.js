let db = require("./models/index");

let P_THEM_NGUOIDUNG = `
CREATE OR REPLACE PROCEDURE P_THEM_NGUOIDUNG(
    V_NgheNghiep IN "NguoiDung"."NgheNghiep"%TYPE,
    V_Email IN "NguoiDung"."Email"%TYPE,
    V_SDT IN "NguoiDung"."SDT"%TYPE, 
    V_DiaChi IN "NguoiDung"."DiaChi"%TYPE, 
    V_CCCD IN "NguoiDung"."CCCD"%TYPE, 
    V_HoTen IN "NguoiDung"."HoTen"%TYPE, 
    D_NgaySinh IN NVARCHAR2, 
    B_GioiTinh IN "NguoiDung"."GioiTinh"%TYPE, 
    V_username IN "NguoiDung"."username"%TYPE, 
    V_password IN "NguoiDung"."password"%TYPE, 
    N_MaNhom IN "NguoiDung"."MaNhom"%TYPE
)
IS
BEGIN
	
	INSERT INTO "NguoiDung" ("NgayDK","NgheNghiep","Email","SDT","DiaChi","CCCD","HoTen","NgaySinh","GioiTinh","username","password","MaNhom") VALUES (CURRENT_TIMESTAMP, V_NgheNghiep, V_Email, V_SDT, V_DiaChi, V_CCCD, V_HoTen,TO_DATE(D_NgaySinh,'DD-MM-YYYY'), B_GioiTinh, V_username,V_password, N_MaNhom); 	
	COMMIT;
END; 
`;

let P_THEM_NGUOIDUNG_SAMPLE = `
CREATE OR REPLACE
PROCEDURE P_THEM_NGUOIDUNG_SAMPLE(
    V_SoLuong IN NUMBER
)
IS
BEGIN
	insert INTO "NguoiDung" ("NgayDK",
	"NgheNghiep",
	"Email",
	"SDT",
	"DiaChi",
	"CCCD",
	"HoTen",
	"NgaySinh",
	"GioiTinh",
	"username",
	"password",
	"MaNhom")
	select CURRENT_TIMESTAMP, 'Nghe ' || round(dbms_random.value(1, 5)),'nguoidung' || to_char(rownum) || '@gmail.com', round(dbms_random.value(100000000, 999999999)),'HCM', round(dbms_random.value(100000000, 999999999)), 'Nguoi Dung ' || to_char(rownum) , add_months(CURRENT_TIMESTAMP, -20*12), round(dbms_random.value(0, 1)), 'nguoidung' || to_char(rownum), round(dbms_random.value(100000, 999999)), round(dbms_random.value(1, 5))
from dual
connect by level <= V_SoLuong;
COMMIT;
END; 
`;

let P_THEM_TAIKHOAN = `
CREATE OR REPLACE PROCEDURE P_THEM_TAIKHOAN(
    V_SoTaiKhoan IN "TaiKhoan"."SoTaiKhoan"%TYPE,
    N_MaKhachHang IN "TaiKhoan"."MaKhachHang"%TYPE,
    V_LoaiTaiKhoan IN "TaiKhoan"."LoaiTaiKhoan"%TYPE, 
    N_SoDu IN "TaiKhoan"."SoDu"%TYPE, 
    V_TrangThai IN "TaiKhoan"."TrangThai"%TYPE
)
IS
BEGIN
	
	INSERT INTO "TaiKhoan" ("SoTaiKhoan","MaKhachHang","LoaiTaiKhoan","SoDu","NgayMo","TrangThai") VALUES (V_SoTaiKhoan, N_MaKhachHang, V_LoaiTaiKhoan, N_SoDu, CURRENT_TIMESTAMP, V_TrangThai); 	
	COMMIT;
END;
`;

let P_THEM_GIAODICH = `
CREATE OR REPLACE PROCEDURE P_THEM_GIAODICH(
  N_SoTien IN "GiaoDich"."SoTien"%TYPE,
  V_NoiDung IN "GiaoDich"."NoiDung"%TYPE,
  V_SoTKNhan IN "GiaoDich"."SoTKNhan"%TYPE,
  V_SoTKRut IN "GiaoDich"."SoTKRut"%TYPE, 
  N_MaLoaiGD IN "GiaoDich"."MaLoaiGD"%TYPE, 
  N_MaNhanVien IN "GiaoDich"."MaNhanVien"%TYPE,
  V_CCCD IN "GiaoDich"."CCCD"%TYPE
)
IS 
TenLoaiGD "LoaiGiaoDich"."TenLoaiGD"%TYPE;
TienChuyenToiThieu NUMBER;
TienChuyenToiDa NUMBER;
TONGTIEN NUMBER;
PHI NUMBER;
SODU NUMBER;
SODUTOITHIEU NUMBER;
  SOTIENRUTTOITHIEU NUMBER;
N_ERRCODE NUMBER;
  V_MESSAGE NVARCHAR2(255);
BEGIN
-- Xác định tên loại giao dịch

SELECT "TenLoaiGD" INTO TenLoaiGD
FROM "LoaiGiaoDich"
WHERE "MaLoaiGD" = N_MaLoaiGD;

IF TenLoaiGD IS NULL THEN
  RAISE_APPLICATION_ERROR(-20004, 'Khong ton tai loai giao dich');
END IF;	
  
-- Tính phí giao dịch
SELECT "Phi" INTO PHI
FROM "LoaiGiaoDich"
WHERE "MaLoaiGD" =	N_MaLoaiGD;

-- Lấy số dư tối thiểu
SELECT "GiaTri" INTO SODUTOITHIEU
FROM "ThamSo"
WHERE "Ten" = 'SoTienDuyTriTaiKhoan';

-- HANDLE TRANSFER TRACSACTION

IF TenLoaiGD = 'transfer' THEN
  
  -- Lấy số tiền chuyển khoản tối thiểu
  SELECT "GiaTri" INTO TienChuyenToiThieu
  FROM "ThamSo"
  WHERE "Ten" = 'SoTienChuyenKhoanToiThieu';

  -- Lấy số tiền chuyển khoản tối đa
  SELECT "GiaTri" INTO TienChuyenToiDa
  FROM "ThamSo"
  WHERE "Ten" = 'SoTienChuyenKhoanToiDa';
  
  -- Kiểm tra số tiền tối thiểu
  IF N_SoTien < TienChuyenToiThieu THEN
    N_ERRCODE := 1;
    V_MESSAGE := 'So tien chuyen khoan phai lon hon muc toi thieu';
    RAISE_APPLICATION_ERROR(-20001, V_MESSAGE);
  END IF;
  -- Kiểm tra số tiền tối đa
  IF N_SoTien > TienChuyenToiDa THEN
    N_ERRCODE := 2;
    V_MESSAGE := 'So tien chuyen khoan phai nho hon muc toi da';
    RAISE_APPLICATION_ERROR(-20002, V_MESSAGE);
  END IF;

  -- Tính tổng tiền
  TONGTIEN := PHI + N_SoTien;

  -- Tính số dư của tài khoản sau khi chuyển
  SELECT "SoDu" INTO SODU
  FROM "TaiKhoan"
  WHERE "SoTaiKhoan" = V_SoTKRut;

  SODU := SODU - TONGTIEN;
  -- Kiểm tra số dư tối thiểu
  IF SODU < SODUTOITHIEU THEN
    N_ERRCODE := 3;
    V_MESSAGE := 'So du phai lon hon so tien duy tri tai khoan';
    RAISE_APPLICATION_ERROR(-20003, V_MESSAGE);
  END IF;

  -- Trừ tiền tài khoản gửi
  UPDATE "TaiKhoan"
  SET "SoDu" = SODU
  WHERE "SoTaiKhoan" = V_SoTKRut;

  -- Cộng tiền tài khoản nhận
  UPDATE "TaiKhoan"
  SET "SoDu" = "SoDu" + N_SoTien
  WHERE "SoTaiKhoan" = V_SoTKNhan;

ELSIF TenLoaiGD = 'withdraw' THEN
  SELECT "GiaTri" INTO SOTIENRUTTOITHIEU
  FROM "ThamSo"
  WHERE "Ten" = 'SoTienRutToiThieu';

  IF N_SoTien < SOTIENRUTTOITHIEU THEN
    N_ERRCODE := 1;
    V_MESSAGE := 'So tien rut khoan phai lon hon muc toi thieu';
    RAISE_APPLICATION_ERROR(-20001, V_MESSAGE);
  END IF;

  -- Tính tổng tiền
  TONGTIEN := PHI + N_SoTien;

  -- Tính số dư của tài khoản sau khi chuyển
  SELECT "SoDu" INTO SODU
  FROM "TaiKhoan"
  WHERE "SoTaiKhoan" = V_SoTKRut;

  SODU := SODU - TONGTIEN;
  -- Kiểm tra số dư tối thiểu
  IF SODU < SODUTOITHIEU THEN
    N_ERRCODE := 3;
    V_MESSAGE := 'So du phai lon hon so tien duy tri tai khoan';
    RAISE_APPLICATION_ERROR(-20003, V_MESSAGE);
  END IF;

  -- Trừ tiền tài khoản gửi
  UPDATE "TaiKhoan"
  SET "SoDu" = SODU
  WHERE "SoTaiKhoan" = V_SoTKRut;

ELSE -- deposit transaction
  -- Tính tổng tiền
  TONGTIEN := N_SoTien - PHI;

  -- Tính số dư của tài khoản sau nộp tiền
  SELECT "SoDu" INTO SODU
  FROM "TaiKhoan"
  WHERE "SoTaiKhoan" = V_SoTKNhan;
  
  SODU := SODU + TONGTIEN;

  UPDATE "TaiKhoan"
  SET "SoDu" = SODU
  WHERE "SoTaiKhoan" = V_SoTKNhan;
  
END IF;

INSERT INTO "GiaoDich" ("SoTien", "SoDu", "ThoiGian","NoiDung","TongTien","SoTKNhan","SoTKRut","MaLoaiGD","MaNhanVien") VALUES (N_SoTien, SODU, CURRENT_TIMESTAMP, V_NoiDung, TONGTIEN, V_SoTKNhan, V_SoTKRut, N_MaLoaiGD, N_MaNhanVien);

COMMIT;
END; 
`;

let P_THEM_PHIEUTIETKIEM = `
CREATE OR REPLACE PROCEDURE P_THEM_PHIEUTIETKIEM(
  V_MaPhieu IN "PhieuTietKiem"."MaPhieu"%TYPE,
  N_SoTienGui IN "PhieuTietKiem"."SoTienGui"%TYPE,
  V_PhuongThuc IN "PhieuTietKiem"."PhuongThuc"%TYPE,
  N_MaLoaiTietKiem IN "PhieuTietKiem"."MaLoaiTietKiem"%TYPE,
  N_MaKhachHang IN "PhieuTietKiem"."MaKhachHang"%TYPE,
  V_SoTK IN "PhieuTietKiem"."SoTK"%TYPE,
  N_MaNhanVien IN "GiaoDich"."MaNhanVien"%TYPE
)
IS
SoDu NUMBER;
SoDuToiThieu NUMBER;
  TienTietKiemToiThieu NUMBER;
  V_MESSAGE NVARCHAR2(255);
  MaLoaiGD NUMBER;
   LaiSuat "PhieuTietKiem"."LaiSuat"%TYPE;
BEGIN

SELECT "GiaTri" INTO TienTietKiemToiThieu
FROM "ThamSo"
WHERE "Ten" = 'TienGuiTietKiemToiThieu';

SELECT "GiaTri" INTO SoDuToiThieu
FROM "ThamSo"
WHERE "Ten" = 'SoTienDuyTriTaiKhoan';

SELECT "LaiSuat" INTO LaiSuat
FROM "LoaiTietKiem"
WHERE "MaLoaiTietKiem" = N_MaLoaiTietKiem;

-- Kiểm tra tiền gửi tối thiểu
IF N_SoTienGui < TienTietKiemToiThieu THEN
  V_MESSAGE := 'So tien gui tiet kiem phai lon hon ' || TienTietKiemToiThieu;
  RAISE_APPLICATION_ERROR(-20001, V_MESSAGE);
END IF;

IF V_SoTK IS NOT NULL THEN

  -- Kiểm tra số dư tối thiểu
  SELECT "SoDu" INTO SoDu
  FROM "TaiKhoan"
  WHERE "SoTaiKhoan" = V_SoTK;

  SoDu := SoDu - 	N_SoTienGui;
  
  IF SoDu < SoDuToiThieu THEN
    V_MESSAGE := 'So du con lai khong du de thuc hien giao dich ';
    RAISE_APPLICATION_ERROR(-20002, V_MESSAGE);
  END IF;
  
  -- Trừ tiền tài khoản gửi
  UPDATE "TaiKhoan"
  SET "SoDu" = SoDu
  WHERE "SoTaiKhoan" = V_SoTK;

END IF;

-- Lấy mã gd tiết kiệm
SELECT "MaLoaiGD" INTO MaLoaiGD
FROM "LoaiGiaoDich"
WHERE "TenLoaiGD" = 'saving';

-- Lưu phiếu tiết kiệm
INSERT INTO "PhieuTietKiem" ("MaPhieu", "NgayMo", "SoTienGui", "LaiSuat", "NgayRut", "SoTienRut", "PhuongThuc", "TrangThai", "MaLoaiTietKiem", "MaKhachHang", "SoTK") VALUES (V_MaPhieu, CURRENT_TIMESTAMP, N_SoTienGui, LaiSuat, NULL, NULL, V_PhuongThuc, 1, N_MaLoaiTietKiem, N_MaKhachHang, V_SoTK);

-- Lưu giao dịch nộp tiền vào bảng giao dịch
INSERT INTO "GiaoDich" ("SoTien", "SoDu", "ThoiGian" ,"NoiDung", "TongTien", "SoTKNhan", "SoTKRut", "MaLoaiGD", "MaNhanVien", "MaPhieu") VALUES (N_SoTienGui, SODU, CURRENT_TIMESTAMP, 'saving', N_SoTienGui, null, V_SoTK, MaLoaiGD, N_MaNhanVien, V_MaPhieu);
  
END;
`;

let P_TATTOAN_PHIEUTIETKIEM = `
CREATE OR REPLACE PROCEDURE P_TATTOAN_PHIEUTIETKIEM(
  V_MaPhieu IN "PhieuTietKiem"."MaPhieu"%TYPE,
  N_MaNhanVien IN "GiaoDich"."MaNhanVien"%TYPE
)
IS
SoDu NUMBER;
  ThoiGianGuiTietKiemToiThieu NUMBER;
  V_MESSAGE NVARCHAR2(255);
NgayGui TIMESTAMP WITH LOCAL TIME ZONE;
NgayChenhLech NUMBER;
NgayMo TIMESTAMP WITH LOCAL TIME ZONE;
KyHan NUMBER;
MaLoaiTietKiem "PhieuTietKiem"."MaLoaiTietKiem"%TYPE;
NgayDenHan TIMESTAMP WITH LOCAL TIME ZONE;
LaiSuat NUMBER;
TienGui "PhieuTietKiem"."SoTienGui"%TYPE;
TienRut "PhieuTietKiem"."SoTienRut"%TYPE;
SoTaiKhoan "TaiKhoan"."SoTaiKhoan"%TYPE;
MaLoaiGD "LoaiGiaoDich"."MaLoaiGD"%TYPE;
TrangThaiPhieu "PhieuTietKiem"."TrangThai"%TYPE;
BEGIN

-- Kiểm tra phiếu còn hiệu lực không
SELECT "TrangThai" INTO TrangThaiPhieu
FROM "PhieuTietKiem"
WHERE "MaPhieu" = V_MaPhieu; 

IF TrangThaiPhieu = '0' THEN
  V_MESSAGE := 'Phiếu đã tất toán ' || ThoiGianGuiTietKiemToiThieu;
  RAISE_APPLICATION_ERROR(-20001, V_MESSAGE);
END IF;

-- Load thời gian tiết kiệm tối thiểu

SELECT "GiaTri" INTO ThoiGianGuiTietKiemToiThieu
FROM "ThamSo"
WHERE "Ten" = 'ThoiGianGuiTietKiemToiThieu';

-- Tính số ngày chênh lệch 
SELECT "NgayMo" INTO NgayMo 
FROM "PhieuTietKiem" 
WHERE "MaPhieu" = V_MaPhieu;

NgayChenhLech := EXTRACT(DAY FROM CURRENT_TIMESTAMP - NgayMo);

-- Kiểm tra ngày gửi tối thiểu tối thiểu
IF NgayChenhLech < ThoiGianGuiTietKiemToiThieu THEN
  V_MESSAGE := 'Ngay gui tiet kiem phai lon hon ' || ThoiGianGuiTietKiemToiThieu;
  RAISE_APPLICATION_ERROR(-20002, V_MESSAGE);
END IF;

-- Kiểm tra ngày rút có bằng ngày đến hạn
SELECT "MaLoaiTietKiem" INTO MaLoaiTietKiem
FROM "PhieuTietKiem"
WHERE "MaPhieu" = V_MaPhieu;

SELECT "KyHan" INTO KyHan
FROM "LoaiTietKiem"
WHERE "MaLoaiTietKiem" = MaLoaiTietKiem;

NgayDenHan := ADD_MONTHS(NgayMo, KyHan) - 1;

IF CURRENT_TIMESTAMP > NgayDenHan THEN
  SELECT "LaiSuat" INTO LaiSuat
  FROM "PhieuTietKiem"
  WHERE "MaPhieu" = V_MaPhieu;
ELSE
  SELECT "LaiSuat" INTO LaiSuat
  FROM "LoaiTietKiem"
  WHERE "KyHan" = 0;

  -- Update lại thông tin phiếu tiết kiệm
  UPDATE "PhieuTietKiem"
  SET "LaiSuat" = LaiSuat
  WHERE "MaPhieu" = V_MaPhieu;

  UPDATE "PhieuTietKiem"
  SET "MaLoaiTietKiem" = 0
  WHERE "MaPhieu" = V_MaPhieu;
  
END IF;

SELECT "SoTienGui" INTO TienGui
FROM "PhieuTietKiem"
WHERE "MaPhieu" = V_MaPhieu;

--  Update ngày rút

UPDATE "PhieuTietKiem"
SET "NgayRut" = CURRENT_TIMESTAMP
WHERE "MaPhieu" = V_MaPhieu;
-- Tính tiền rút = tiền gốc cộng lãi
TienRut := TINHLAI(TienGui, NgayChenhLech, LaiSuat);
-- Update tiền rút 
UPDATE "PhieuTietKiem" 
SET "SoTienRut" = TienRut
WHERE "MaPhieu" = V_MaPhieu;

SELECT "SoTK" INTO SoTaiKhoan
FROM "PhieuTietKiem"
WHERE "MaPhieu" = V_MaPhieu;

IF SoTaiKhoan IS NOT NULL THEN

  -- Cộng tiền tài khoản gửi tiết kiệm
  SELECT "SoDu" INTO SoDu
  FROM "TaiKhoan"
  WHERE "SoTaiKhoan" = SoTaiKhoan;

  SoDu := SoDu + 	TienRut;

  -- Cộng tiền tài khoản gửi
  UPDATE "TaiKhoan"
  SET "SoDu" = SoDu
  WHERE "SoTaiKhoan" = SoTaiKhoan;
END IF;

-- Lấy mã gd tiết kiệm
SELECT "MaLoaiGD" INTO MaLoaiGD
FROM "LoaiGiaoDich"
WHERE "TenLoaiGD" = 'settlement';

-- Chuyển trạng thái phiếu về không hoạt động:
UPDATE "PhieuTietKiem" 
SET "TrangThai"  = 0
WHERE "MaPhieu" = V_MaPhieu;

-- Lưu giao dịch nộp tiền vào bảng giao dịch
INSERT INTO "GiaoDich" ("SoTien", "SoDu", "ThoiGian" ,"NoiDung", "TongTien", "SoTKNhan", "SoTKRut", "MaLoaiGD", "MaNhanVien", "MaPhieu") VALUES (TienRut, SoDu, CURRENT_TIMESTAMP, 'settlement', TienRut, SoTaiKhoan, null, MaLoaiGD, N_MaNhanVien, V_MaPhieu);
  
END;
`;

const createProcedure = async (procedure) => {
  try {
    await db.sequelize.query(procedure);
    console.log("Creating procedure");
    console.log("------------------");
  } catch (error) {
    console.log("Create procedure fail, check connect to database!");
  }

  return;
};

console.log("Starting create procedure...");

createProcedure(P_THEM_NGUOIDUNG);
createProcedure(P_THEM_NGUOIDUNG_SAMPLE);
createProcedure(P_THEM_TAIKHOAN);
createProcedure(P_THEM_GIAODICH);
createProcedure(P_THEM_PHIEUTIETKIEM);
createProcedure(P_TATTOAN_PHIEUTIETKIEM);
