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
  V_CCCD IN "GiaoDich"."CCCD"%TYPE,
  N_ERRCODE OUT NUMBER,
  V_MESSAGE OUT NVARCHAR2
)
IS 
TenLoaiGD "LoaiGiaoDich"."TenLoaiGD"%TYPE;
TienChuyenToiThieu NUMBER;
TienChuyenToiDa NUMBER;
TONGTIEN NUMBER;
PHI NUMBER;
SODU NUMBER;
SODUTOITHIEU NUMBER;
BEGIN
-- Xác định tên loại giao dịch

SELECT "TenLoaiGD" INTO TenLoaiGD
FROM "LoaiGiaoDich"
WHERE "MaLoaiGD" = N_MaLoaiGD;


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
    RAISE_APPLICATION_ERROR(-20001, V_MESSAGE);
  END IF;

  -- Tính phí chuyển chuyển khoản
  SELECT "Phi" INTO PHI
  FROM "LoaiGiaoDich"
  WHERE "MaLoaiGD" =	N_MaLoaiGD;

  -- Tính tổng tiền
  TONGTIEN := PHI + N_SoTien;

  -- Lấy số dư tối thiểu
  SELECT "GiaTri" INTO SODUTOITHIEU
  FROM "ThamSo"
  WHERE "Ten" = 'SoTienDuyTriTaiKhoan';

  -- Tính số dư của tài khoản sau khi chuyển
  SELECT "SoDu" INTO SODU
  FROM "TaiKhoan"
  WHERE "SoTaiKhoan" = V_SoTKRut;

  SODU := SODU - TONGTIEN;
  -- Kiểm tra số dư tối thiểu
  IF SODU < SODUTOITHIEU THEN
    N_ERRCODE := 3;
    V_MESSAGE := 'So du phai lon hon so tien duy tri tai khoan';
    RAISE_APPLICATION_ERROR(-20001, V_MESSAGE);
  END IF;

  -- Trừ tiền tài khoản gửi
  UPDATE "TaiKhoan"
  SET "SoDu" = SODU
  WHERE "SoTaiKhoan" = V_SoTKRut;

  -- Cộng tiền tài khoản nhận
  UPDATE "TaiKhoan"
  SET "SoDu" = "SoDu" + N_SoTien
  WHERE "SoTaiKhoan" = V_SoTKNhan;

  INSERT INTO "GiaoDich" ("SoTien", "SoDu", "ThoiGian","NoiDung","TongTien","SoTKNhan","SoTKRut","MaLoaiGD","MaNhanVien") VALUES (N_SoTien, SODU, CURRENT_TIMESTAMP, V_NoiDung, TONGTIEN, V_SoTKNhan, V_SoTKRut, N_MaLoaiGD, N_MaNhanVien); 

ELSIF TenLoaiGD = 'withdraw' THEN
  dbms_output.put_line('withdraw');
ELSIF TenLoaiGD = 'deposit' THEN
  dbms_output.put_line('deposit');
ELSE
  dbms_output.put_line('Khong ton tai loai giao dich');
END IF;

COMMIT;
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
