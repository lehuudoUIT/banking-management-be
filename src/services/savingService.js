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
  MaNhanVien,
  isAuto
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let MaPhieu = uuidv4();

      let plsql = `
        BEGIN
        P_THEM_PHIEUTIETKIEM (:maphieu, :sotien, :phuongthuc, :maloaitk, :makh, :stk, :manv, :isauto);
        END;
        `;

      //! Tạo giao dịch tiết kiệm
      await db.sequelize
        .query(plsql, {
          replacements: {
            maphieu: MaPhieu,
            sotien: SoTienGui,
            phuongthuc: PhuongThuc,
            maloaitk: MaLoaiTietKiem,
            makh: MaKhachHang,
            stk: SoTK || null,
            manv: MaNhanVien,
            isauto: isAuto,
          },
        })
        .catch((err) => {
          let errMessages = err.message.split("\n")[0];

          resolve({
            errMessage: 5,
            message: "Create saving failed!",
            err: errMessages,
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
          let errMessages = err.message.split("\n")[0];
          resolve({
            errMessage: 3,
            message: "Withdraw saving failed!",
            err: errMessages,
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

const createSavingReport = async (Ngay, isCreateReport) => {
  return new Promise(async (resolve, reject) => {
    //? Lấy ngày lập tiết kiệm
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

    // ? Xây dựng query lấy báo cáo trong ngày lập
    const query = {
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn("trunc", Sequelize.col("Ngay")),
            "=",
            startDate
          ),
        ],
      },
      raw: true,
      attributes: { exclude: ["Ngay"] },
    };

    //? Kiểm tra báo cáo đã lập hay chưa
    let baoCao = await db.BaoCaoDoanhSo.findAll(query).catch((err) => {
      console.log(err);
    });

    if (baoCao.length > 0) {
      console.log(`Ngày ${Ngay} đã lập báo cáo`);
      return resolve({
        errMessage: 0,
        message: "Get report sucessfully!",
        ThongKe: baoCao,
      });
    }

    //? Tính tổng thu của từng loại tiết kiệm trong ngày yêu cầu
    let Thu = await db.PhieuTietKiem.findAll({
      where: {
        NgayMo: {
          [Op.between]: [startDate, endDate],
        },
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

    //? Tính tổng chi của từng loại tiết kiệm trong ngày yêu cầu
    let Chi = await db.PhieuTietKiem.findAll({
      where: {
        NgayRut: {
          [Op.between]: [startDate, endDate],
        },
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

    //? Tính chênh lệch thu chi
    for (let i = 0; i < lengthSavingType; i++) {
      let item = {};
      item.MaLoaiTietKiem = i + 1;
      item.TongThu = Thu[i].TongThu;
      item.TongChi = Chi[i].TongChi;
      item.ChenhLech = Thu[i].TongThu - Chi[i].TongChi;
      ThongKe.push(item);
    }

    //? Lưu thống kê vào cơ sở dữ liệu
    if (isCreateReport) {
      insertReport(startDate, ThongKe);
    }

    resolve({
      errMessage: 0,
      message: "Get report sucessfully!",
      ThongKe: ThongKe,
    });
  });
};

const insertReport = async (Ngay, ThongKe) => {
  for (let loatTietKiem of ThongKe) {
    await db.BaoCaoDoanhSo.create({
      Ngay: Ngay,
      MaLoaiTietKiem: loatTietKiem.MaLoaiTietKiem,
      TongThu: loatTietKiem.TongThu,
      TongChi: loatTietKiem.TongChi,
      ChenhLech: loatTietKiem.ChenhLech,
    }).catch((err) => {
      console.log("🚀 ~ insertReport ~ err:", err);
    });
  }
};

const getListSaving = async (manhom, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let tennhom = await db.NhomNguoiDung.findOne({
        where: {
          MaNhom: manhom,
        },
        raw: true,
      })
        .then((result) => {
          return result.TenNhom;
        })
        .catch((err) => {
          console.log(err);
        });

      if (tennhom === "Customer") {
        //! Nếu người dùng là khách hàng chỉ trả về danh sách phiếu tiết kiệm của khách hàng
        await db.NguoiDung.findAll({
          where: {
            Email: email,
          },
          include: { model: db.PhieuTietKiem },
          raw: true,
          nest: true,
        })
          .then((result) => {
            if (!result || result.length == 0) {
              resolve({
                errCode: 1,
                message: "User does not have saving account!",
              });
            } else {
              let newResult = [];

              result.forEach((element) => {
                if (element.PhieuTietKiems.TrangThai == 1)
                  newResult.push(element.PhieuTietKiems);
              });

              resolve({
                errMessage: 0,
                message: "Get list savings successfully!",
                accounts: newResult,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        //! Lấy toàn bộ danh sách phiếu tiết kiệm
        db.PhieuTietKiem.findAll()
          .catch((err) => {
            console.log(err);
          })
          .then((result) => {
            resolve({
              errCode: 0,
              message: "Get list savings successfully!",
              accounts: result,
            });
          })
          .catch((err) => {
            console.log(err);
            resolve({
              errCode: 3,
              message: "Get list savings unsuccessfully!",
              err: err,
            });
          });
      }
    } catch (error) {
      reject({
        errCode: 2,
        message: "Get list savings unsuccessfully!",
        err: error,
      });
    }
  });
};

const getSavingByAccountId = async (SoTaiKhoan, TrangThai) => {
  return new Promise((resolve, reject) => {
    try {
      // ! Check tài khoản có tồn tại hay không
      db.TaiKhoan.findOne({
        where: {
          SoTaiKhoan: SoTaiKhoan,
        },
      }).then((result) => {
        if (!result || result.length == 0)
          return resolve({
            errMessage: 4,
            message: "Account does not exist!",
          });
      });

      let condition = {
        SoTK: SoTaiKhoan,
        TrangThai: TrangThai,
      };

      if (condition.TrangThai != 0 && condition.TrangThai != 1) {
        delete condition.TrangThai;
      }

      let savings = db.PhieuTietKiem.findAll({
        where: condition,
        include: [{ model: db.LoaiTietKiem }],
        nest: true,
        raw: true,
      })
        .then((result) => {
          console.log(result);
          if (!result || result.length == 0)
            return resolve({
              errMessage: 0,
              message: "Account do not have any saving!",
            });

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
          resolve({
            errMessage: 1,
            message: "Get savings failed!",
            error: err,
          });
        });
    } catch (error) {
      resolve({
        errMessage: 2,
        message: "Get savings failed!",
        error: error,
      });
    }
  });
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

const createSavingType = async (KyHan, LaiSuat, GhiChu) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.LoaiTietKiem.create({
        KyHan: KyHan,
        LaiSuat: LaiSuat,
        GhiChu: GhiChu,
      }).catch((err) => {
        console.log(err);
      });

      resolve({
        errCode: 0,
        message: "Create saving type successfully!",
      });
    } catch (error) {
      reject({
        errCode: 2,
        message: "Create saving type unsuccessfully!",
        error: error,
      });
    }
  });
};
const deleteSavingType = async (MaLoaiTietKiem) => {
  return new Promise(async (resolve, reject) => {
    try {
      //? delete the role
      await db.LoaiTietKiem.destroy({
        where: {
          MaLoaiTietKiem: MaLoaiTietKiem,
        },
      }).catch((err) => {
        console.log(err);
        resolve({
          errCode: 2,
          message: "Delete saving type unsuccessfully!",
        });
      });

      resolve({
        errCode: 0,
        message: `Delete saving type (id: ${MaLoaiTietKiem}) successfully!`,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: `Delete saving type (id: ${MaLoaiTietKiem}) unsuccessfully!`,
        error: error,
      });
    }
  });
};

const updateSavingType = async (MaLoaiTietKiem, LaiSuat, GhiChu) => {
  return new Promise(async (resolve, reject) => {
    try {
      //? update role
      await db.LoaiTietKiem.update(
        {
          LaiSuat: LaiSuat,
          GhiChu: GhiChu,
        },
        {
          where: {
            MaLoaiTietKiem: MaLoaiTietKiem,
          },
        }
      ).catch((err) => {
        console.log(err);
        resolve({
          errCode: 0,
          message: `Update saving type(id: ${MaLoaiTietKiem}) unsuccessfully!`,
        });
      });
      resolve({
        errCode: 0,
        message: `Update saving type(id: ${MaLoaiTietKiem}) successfully!`,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: `Update saving type(id: ${MaLoaiTietKiem}) unsuccessfully!`,
        error: error,
      });
    }
  });
};

module.exports = {
  depositSaving,
  getSavingType,
  withdrawSaving,
  tinhTienLai,
  createSavingReport,
  getListSaving,
  getSavingByAccountId,
  getSavingByAccountCCCD,
  createSavingType,
  deleteSavingType,
  updateSavingType,
};
