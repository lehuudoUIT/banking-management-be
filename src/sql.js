console.log("Sql command");
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

const createProcedure = async (procedure) => {
  await db.sequelize.query(procedure);
  return;
};

createProcedure(P_THEM_NGUOIDUNG);
createProcedure(P_THEM_NGUOIDUNG_SAMPLE);
