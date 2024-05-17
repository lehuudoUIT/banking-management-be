import db from "../models/index";
import { tinhTienLai } from "./savingService";
const createUser = async (
  NgheNghiep,
  Email,
  SDT,
  DiaChi,
  CCCD,
  HoTen,
  NgaySinh,
  GioiTinh,
  username,
  password,
  MaNhom
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkExist = await checkExistUser(Email, SDT, CCCD, username);

      if (checkExist.length > 0) {
        resolve({
          errCode: 3,
          message: checkExist,
        });
      } else {
        let plsql = `
          BEGIN
          P_THEM_NGUOIDUNG (:nghenghiep, :email, :sdt, :diachi, :cccd, :hoten, :ngaysinh, :gioitinh, :username, :password, :manhom);
          END;
          `;

        await db.sequelize
          .query(plsql, {
            replacements: {
              nghenghiep: NgheNghiep,
              email: Email,
              sdt: SDT,
              diachi: DiaChi,
              cccd: CCCD,
              hoten: HoTen,
              ngaysinh: NgaySinh,
              gioitinh: GioiTinh,
              username: username,
              password: password,
              manhom: MaNhom,
            },
          })
          .catch((err) => {
            resolve({
              errMessage: 4,
              message: "Create user failer!",
              err: err,
            });
          });

        resolve({
          errMessage: 0,
          message: "Create user successfully!",
        });
      }
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create user failed!",
        errMess: error,
      });
    }
  });
};

const isExistedCCCD = async (CCCD) => {
  let cccd = await db.NguoiDung.findOne({
    where: {
      CCCD: CCCD,
    },
    raw: true,
    attributes: ["CCCD"],
  });

  return cccd;
};

const createWithdrawTransaction = async (
  CCCD,
  SoTien,
  NoiDung,
  SoTKRut,
  MaLoaiGD,
  MaNhanVien
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExisted = await isExistedCCCD(CCCD);
      if (!isExisted) {
        resolve({
          message: "Sender does not exist!",
          errCode: 1,
        });
      } else {
        let taiKhoanRut = await db.TaiKhoan.findOne({
          where: {
            SoTaiKhoan: SoTKRut,
          },
          raw: true,
        });
        if (!taiKhoanRut) {
          resolve({
            message: "Withdrawal account does not exist!",
            errCode: 2,
          });
        } else {
          let loaigd = await db.LoaiGD.findOne({
            where: {
              MaLoaiGD: MaLoaiGD,
            },
            raw: true,
          });

          let TongTien = SoTien + loaigd.Phi;

          taiKhoanRut.SoDu -= TongTien;
          if (taiKhoanRut.SoDu <= 50000) {
            return resolve({
              message: "Withdrawal account does not have enough money!",
              errCode: 3,
            });
          }

          await taiKhoanRut.save();

          let plsql = `
          BEGIN
          P_THEM_GIAODICH (:sotien, :sodu, :noidung, :tongtien, :sotknhan, :sotkrut, :maloaigd, :manv, :cccd);
          END;
          `;

          await db.sequelize.query(plsql, {
            replacements: {
              sotien: SoTien,
              sodu: taiKhoanRut.SoDu,
              noidung: NoiDung,
              tongtien: TongTien,
              sotknhan: null,
              stkrut: SoTKRut,
              maloaigd: MaLoaiGD,
              manv: MaNhanVien,
              cccd: CCCD,
            },
          });

          resolve({
            message: `With draw from ${SoTKRut} successfully!`,
            errCode: 0,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const checkExistUser = async (Email, SDT, CCCD, username) => {
  let message = [];
  let email = await db.NguoiDung.findOne({
    where: {
      Email: Email,
    },
    raw: true,
  });
  if (email) message.push("Email has already existed !");
  let sdt = await db.NguoiDung.findOne({
    where: {
      SDT: SDT,
    },
    raw: true,
  });

  if (sdt) message.push("SDT has already existed !");

  let cccd = await db.NguoiDung.findOne({
    where: {
      CCCD: CCCD,
    },
    raw: true,
  });

  if (cccd) message.push("CCCD has already existed !");

  let user = await db.NguoiDung.findOne({
    where: {
      username: username,
    },
    raw: true,
  });

  if (user) message.push("username has already existed !");
  return message;
};

const getSavingByAccountCCCD = async (CCCD, TrangThai) => {
  return new Promise(async (resolve, reject) => {
    try {
      let KhachHang = await db.NguoiDung.findOne({
        where: {
          CCCD: CCCD,
        },
        raw: true,
      }).catch((err) => {
        reject({
          errMessage: 1,
          message: "Get savings failed!",
          error: err,
        });
      });
      console.log(KhachHang);

      if (!KhachHang) {
        resolve({
          errMessage: 1,
          message: "Customer does not exist!",
        });
      } else {
        let condition = {
          MaKhachHang: KhachHang.MaNguoiDung,
          TrangThai: TrangThai,
        };
        //Kiểm tra nếu trạng thái không tồn tại thì bỏ trạng thái

        if (TrangThai != 0 && TrangThai != 1) delete condition.TrangThai;
        console.log(condition);

        let savings = await db.PhieuTietKiem.findAll({
          where: condition,
          include: [{ model: db.LoaiTietKiem }],
          nest: true,
          raw: true,
        })
          .then((result) => {
            let transactions = [];

            result.forEach((item) => {
              if (item.TrangThai == 1) {
                let tientamtinh = tinhTienLai(
                  item.SoTienGui,
                  item.LoaiTietKiem.KyHan * 30,
                  Math.round(item.LoaiTietKiem.LaiSuat * 1000) / 1000
                );
                let ngaytamrut = new Date(item.NgayMo);
                ngaytamrut.setMonth(
                  ngaytamrut.getMonth() + item.LoaiTietKiem.KyHan
                );

                let tamtinh = {
                  TienTamTinh: tientamtinh,
                  NgayTamRut: ngaytamrut,
                };

                item.TamTinh = tamtinh;
              }
              transactions.push(item);
            });

            resolve({
              errMessage: 0,
              message: "Get savings sucessfully!",
              transaction: transactions,
            });
          })
          .catch((err) => {
            console.log(err);
            reject({
              errMessage: 1,
              message: "Get savings failed!",
              error: err,
            });
          });
      }
    } catch (error) {
      reject({
        errMessage: 2,
        message: "Get savings failed!",
        error: error,
      });
    }
  });
};

module.exports = {
  getSavingByAccountCCCD,
  createUser,
  createWithdrawTransaction,
};
