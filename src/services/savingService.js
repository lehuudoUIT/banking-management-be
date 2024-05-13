import { Op, where } from "sequelize";
import db, { Sequelize } from "../models/index";
import { v4 as uuidv4 } from "uuid";

// * Tính tiền lãi

const tinhTienLai = (SoTienGui, SoNgayGui, LaiSuat) => {
  let tienLai = SoTienGui;
  for (let i = 0; i < SoNgayGui; i++) {
    tienLai += (SoTienGui * LaiSuat) / 365;
    tienLai = Math.round(tienLai);
  }
  return Math.round(tienLai);
};

const depositSaving = async (
  SoTienGui,
  PhuongThuc,
  MaLoaiTietKiem,
  MaKhachHang,
  SoTK,
  MaNhanVien
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let MaPhieu = uuidv4();

      let plsql = `
        BEGIN
        P_THEM_PHIEUTIETKIEM (:maphieu, :sotien, :phuongthuc, :maloaitk, :makh, :stk, :manv);
        END;
        `;
      let replacements = {
        maphieu: MaPhieu,
        sotien: SoTienGui,
        phuongthuc: PhuongThuc,
        maloaitk: MaLoaiTietKiem,
        makh: MaKhachHang,
        stk: SoTK,
        manv: MaNhanVien,
      };

      //! Tạo giao dịch tiết kiệm
      await db.sequelize
        .query(plsql, {
          replacements: replacements,
        })
        .catch((err) => {
          resolve({
            errMessage: 0,
            message: "Create saving failed!",
            err: err,
          });
        });

      //! lấy thông tin giao dịch tiết kiệm vừa tạo
      let phieutk = await db.PhieuTietKiem.findOne({
        where: {
          MaPhieu: MaPhieu,
        },
        raw: true,
      }).catch((err) => {
        console.log("🚀 ~ returnnewPromise ~ err:", err);
        return {};
      });
      //! Tính tạm tiền có thể nhận và ngày nhận
      let loaitietkiem = await db.LoaiTietKiem.findOne({
        where: {
          MaLoaiTietKiem: MaLoaiTietKiem,
        },
        raw: true,
      }).then((result) => {
        //* Round 2 phần tử sau dấu phẩy
        let laisuat = Math.round(result.LaiSuat * 1000) / 1000;
        return {
          LaiSuat: laisuat,
          KyHan: result.KyHan,
        };
      });

      let tientamtinh = tinhTienLai(
        SoTienGui,
        loaitietkiem.KyHan * 30,
        loaitietkiem.LaiSuat
      );

      let ngaytamrut = new Date();
      ngaytamrut.setMonth(ngaytamrut.getMonth() + loaitietkiem.KyHan);

      let tamtinh = {
        TienTamTinh: tientamtinh,
        NgayTamRut: ngaytamrut,
      };
      resolve({
        errMessage: 0,
        message: "Create saving sucessfully!",
        TamTinh: tamtinh,
        PhieuTietKiem: phieutk,
      });
    } catch (error) {
      reject({
        errMessage: 0,
        message: "Create saving failed!",
        err: error,
      });
    }
  });
};

const withdrawSaving = (MaPhieu, MaNhanVien) => {
  return new Promise(async (resolve, reject) => {
    try {
      let plsql = `
      BEGIN
      P_TATTOAN_PHIEUTIETKIEM (:maphieu, :manv);
      END;
      `;
      let replacements = {
        maphieu: MaPhieu,
        manv: MaNhanVien,
      };

      //! Tạo giao dịch rút tiết kiệm
      await db.sequelize
        .query(plsql, {
          replacements: replacements,
        })
        .catch((err) => {
          resolve({
            errMessage: 0,
            message: "Withdraw saving failed!",
            err: err,
          });
        });

      //! lấy thông tin giao dịch tiết kiệm vừa tạo
      let phieutk = await db.PhieuTietKiem.findOne({
        where: {
          MaPhieu: MaPhieu,
        },
        raw: true,
      }).catch((err) => {
        console.log("🚀 ~ returnnewPromise ~ err:", err);
        return {};
      });
      resolve({
        errMessage: 0,
        message: "Withdraw saving sucessfully!",
        PhieuTietKiem: phieutk,
      });
    } catch (error) {
      reject({
        errMessage: 0,
        message: "Withdraw saving failed!",
        err: error,
      });
    }
  });
};

const getSavingType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let savingTypes = await db.LoaiTietKiem.findAll();
      resolve({
        errMessage: 0,
        message: "Get saving types sucessfully!",
        savingTypes: savingTypes,
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      reject({
        errMessage: 0,
        message: "Get saving types failed!",
        err: error,
      });
    }
  });
};

const createSavingReport = async (Ngay, isCreateReport) => {
  return new Promise(async (resolve, reject) => {
    //! Extract day, month, year from Ngay
    let ReportDate = new Date(Ngay);
    let startDate = new Date(ReportDate);
    ReportDate.setDate(ReportDate.getDate() + 1);
    let endDate = new Date(ReportDate);
    //? Lấy độ dài mã loại tiết kiệm
    let lengthSavingType = await db.LoaiTietKiem.findAll()
      .then((result) => {
        return result.length;
      })
      .catch((err) => {
        console.log(err);
      });

    let Thu = await db.PhieuTietKiem.findAll({
      where: {
        [Op.or]: [
          {
            NgayMo: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            NgayRut: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
        TrangThai: 1,
      },
      attributes: [
        "MaLoaiTietKiem",
        [db.sequelize.fn("sum", db.sequelize.col("SoTienGui")), "TongThu"],
      ],
      group: "MaLoaiTietKiem",
      order: ["MaLoaiTietKiem"],
      raw: true,
    })
      .then((result) => {
        for (let i = 0; i < lengthSavingType; i++) {
          const found = result.find((item) => item.MaLoaiTietKiem === i + 1);
          // If not found, insert an object with TongChi equal to 0 at index i
          if (!found) {
            result.splice(i, 0, { MaLoaiTietKiem: i + 1, TongThu: 0 });
          }
        }
        return result;
      })
      .catch((err) => {
        console.log(err);
      });

    let Chi = await db.PhieuTietKiem.findAll({
      where: {
        [Op.or]: [
          {
            NgayMo: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            NgayRut: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
        TrangThai: 0,
      },
      attributes: [
        "MaLoaiTietKiem",
        [db.sequelize.fn("sum", db.sequelize.col("SoTienRut")), "TongChi"],
      ],
      group: "MaLoaiTietKiem",
      order: ["MaLoaiTietKiem"],

      raw: true,
    })
      .then((result) => {
        for (let i = 0; i < lengthSavingType; i++) {
          const found = result.find((item) => item.MaLoaiTietKiem === i + 1);
          // If not found, insert an object with TongChi equal to 0 at index i
          if (!found) {
            result.splice(i, 0, { MaLoaiTietKiem: i + 1, TongChi: 0 });
          }
        }
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(Thu);
    console.log(Chi);
    let ThongKe = [];
    for (let i = 0; i < lengthSavingType; i++) {
      let item = {};
      item.MaLoaiTietKiem = i + 1;
      item.TongThu = Thu[i].TongThu;
      item.TongChi = Chi[i].TongChi;
      item.ChenhLech = Thu[i].TongThu - Chi[i].TongChi;
      ThongKe.push(item);
    }
    resolve({
      errMessage: 0,
      message: "Get report sucessfully!",
      ThongKe: ThongKe,
    });
  });
};

module.exports = {
  depositSaving,
  getSavingType,
  withdrawSaving,
  tinhTienLai,
  createSavingReport,
};
