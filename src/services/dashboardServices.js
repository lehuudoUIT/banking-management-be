import { Op, where } from "sequelize";
import db, { Sequelize } from "../models/index";

const getListStatistic = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      //? Lấy ngày hôm nay
      //const today = new Date();
      //   const month = dateObj.getUTCMonth() + 1; // months from 1-12
      //   const day = dateObj.getUTCDate();
      //   const year = dateObj.getUTCFullYear();

      //   const newDate = year + "-" + month + "-" + day;
      //console.log(today);
      const TODAY_START = new Date().setHours(0, 0, 0, 0);
      const NOW = new Date();

      let result = {
        NguoiDung: {
          SoLuong: 0,
          Moi: 0,
        },
        GiaoDich: {
          SoLuong: 0,
          Moi: 0,
        },
        TaiKhoan: {
          SoLuong: 0,
          Moi: 0,
        },
      };
      //! User
      //? Tính số lượng người dùng
      await db.NguoiDung.count()
        .then((count) => {
          console.log("SoLuongNguoiDung: " + count);
          result.NguoiDung.SoLuong = count;
        })
        .catch((err) => {
          console.log(err);
        });
      //? Tính số lượng người dùng mới
      await db.NguoiDung.count({
        where: {
          NgayDK: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      })
        .then((count) => {
          console.log("SoLuongNguoiDungMoi: " + count);
          result.NguoiDung.Moi = count;
        })
        .catch((err) => {
          console.log(err);
        });
      //! Transaction
      //? Tính số lượng giao dịch
      await db.GiaoDich.count()
        .then((count) => {
          console.log("SoLuongGiaoDich: " + count);
          result.GiaoDich.SoLuong = count;
        })
        .catch((err) => {
          console.log(err);
        });
      //? Tính số lượng giao dịch mới
      await db.GiaoDich.count({
        where: {
          ThoiGian: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      })
        .then((count) => {
          console.log("SoLuongGiaoDichMoi: " + count);
          result.GiaoDich.Moi = count;
        })
        .catch((err) => {
          console.log(err);
        });

      //! Account
      //? Tính số lượng giao dịch
      await db.TaiKhoan.count()
        .then((count) => {
          console.log("SoLuongTaiKhoan: " + count);
          result.TaiKhoan.SoLuong = count;
        })
        .catch((err) => {
          console.log(err);
        });
      //? Tính số lượng giao dịch mới
      await db.TaiKhoan.count({
        where: {
          NgayMo: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      })
        .then((count) => {
          console.log("SoLuongGiaoDichMoi: " + count);
          result.TaiKhoan.Moi = count;
        })
        .catch((err) => {
          console.log(err);
        });

      resolve({
        errCode: 0,
        message: "Get statistic successfully!",
        result: result,
      });
    } catch (error) {
      console.log(error);
      resolve({
        errCode: 0,
        message: "Get statistic unsuccessfully!",
        error: error,
      });
    }
  });
};

function fillMissingMonths(records) {
  const monthsInYear = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const recordsMap = new Map(records.map((record) => [record.Thang, record]));

  const filledRecords = monthsInYear.map((month) => {
    const record = recordsMap.get(month);
    return {
      Thang: month,
      TongThu: record ? record.TongThu : 0,
      TongChi: record && record.TongChi !== null ? record.TongChi : 0,
    };
  });

  return filledRecords;
}

const getListSavingRevenue = async (year) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(year);
      let START_YEAR = new Date(year, 0, 2);
      let END_YEAR = new Date(year, 11, 31);
      console.log(START_YEAR);
      console.log(END_YEAR);

      let revenueByMonth = await db.sequelize
        .query(
          `SELECT TO_CHAR("NgayMo", 'MM') AS "Thang", SUM("SoTienGui") AS "TongThu", SUM("SoTienRut") AS "TongChi"
         FROM "PhieuTietKiem"
         WHERE EXTRACT(YEAR FROM "NgayMo") = :year
         GROUP BY TO_CHAR("NgayMo", 'MM')
         ORDER BY 1`,
          {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { year: year },
          }
        )
        .then((records) => {
          return fillMissingMonths(records);
        })
        .catch((error) => {
          console.error(error);
        });

      resolve({
        errCode: 0,
        message: "Get statistic successfully!",
        revenueByMonth: revenueByMonth,
      });
    } catch (error) {
      console.log(error);
      resolve({
        errCode: 0,
        message: "Get statistic unsuccessfully!",
        error: error,
      });
    }
  });
};

module.exports = {
  getListStatistic,
  getListSavingRevenue,
};
