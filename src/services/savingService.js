import db from "../models/index";
import { datePrototypeCreate } from "./dateService";
import { v4 as uuidv4 } from "uuid";

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
      let MaPhieu = uuidv4();
      console.log("🚀 ~ returnnewPromise ~ MaPhieu:", MaPhieu);

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

module.exports = {
  depositSaving,
  getSavingType,
};
