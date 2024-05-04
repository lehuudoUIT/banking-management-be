let db = require("./models/index");
await db.sequelize.query();

console.log("Starting to create initial data...");

// Bảng loại giao dịch

let LoaiGD = `
INSERT INTO "LoaiGiaoDich"
("MaLoaiGD", "TenLoaiGD", "Phi")
VALUES(1, 'withdraw', 3000);
INSERT INTO "LoaiGiaoDich"
("MaLoaiGD", "TenLoaiGD", "Phi")
VALUES(2, 'deposit', 3000);
INSERT INTO "LoaiGiaoDich"
("MaLoaiGD", "TenLoaiGD", "Phi")
VALUES(3, 'transfer', 0);
COMMIT;
`;

let ThamSo = `
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(1, 'DoTuoiToiThieu', 15);
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(2, 'SoLuongTaiKhoan', 4);
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(3, 'SoTienDuyTriTaiKhoan', 50000);
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(4, 'SoTienRutToiThieu', 100000);
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(5, 'TienGuiTietKiemToiThieu', 3000000);
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(6, 'SoTienChuyenKhoanToiThieu', 2000);
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(7, 'SoTienChuyenKhoanToiDa', 100000000);
INSERT INTO "ThamSo"
("MaThamSo", "Ten", "GiaTri")
VALUES(8, 'ThoiGianGuiTietKiemToiThieu', 15);
COMMIT;
`;

const insertData = async (data) => {
  try {
    await db.sequelize.query(data);
    console.log("Inserting data");
    console.log("------------------");
  } catch (error) {
    console.log("Inserting data fail, check connect to database!");
  }
};

insertData(LoaiGD);
insertData(ThamSo);
