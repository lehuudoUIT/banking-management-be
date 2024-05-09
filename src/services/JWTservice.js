import db from "../models/index";

const getGroupWithRoles = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 ~ getGroupWithRoles ~ Mã nhóm:", user.MaNhom);

      let roles = await db.NhomNguoiDung.findAll({
        where: {
          MaNhom: user.MaNhom,
        },
        include: [
          {
            model: db.PhanQuyen,
            include: {
              model: db.ChucNang,
            },
          },
        ],
        raw: true,
        nest: true,
      })
        .then((result) => {
          let newResult = [];
          result.forEach((element) => {
            newResult.push(element.PhanQuyen.ChucNang.Url);
          });
          return newResult;
        })
        .catch((err) => {
          console.log(err);
        });
      //console.log(roles);
      resolve(roles);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error);
    }
  });
};

module.exports = {
  getGroupWithRoles,
};
