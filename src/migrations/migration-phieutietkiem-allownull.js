module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("PhieuTietKiem", "SoTienRut", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn("PhieuTietKiem", "NgayRut", {
        allowNull: true,
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn("PhieuTietKiem", "MaKhachHang", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("PhieuTietKiem", "SoTienRut", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn("PhieuTietKiem", "NgayRut", {
        allowNull: true,
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn("PhieuTietKiem", "MaKhachHang", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
