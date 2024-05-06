import db from "../models/index";
import { datePrototypeCreate } from "./dateService";

// * Tính tiền lãi
datePrototypeCreate();

const tinhTienLai = (SoTienGui, SoNgayGui, LaiSuat) => {
  let tienLai = SoTienGui;
  for (let i = 0; i < SoNgayGui; i++) {
    tienLai += (SoTienGui * LaiSuat) / 365;
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
      let plsql = `
        BEGIN
        P_THEM_PHIEUTIETKIEM (:sotien, :phuongthuc, :maloaitk, :makh, :stk, :manv);
        END;
        `;
      let replacements = {
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
          SoTK: SoTK,
        },
        order: [["NgayMo", "DESC"]],
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
      ngaytamrut.addMonths(loaitietkiem.KyHan);

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

module.exports = {
  depositSaving,
};
