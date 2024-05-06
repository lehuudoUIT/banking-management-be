module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("LoaiTietKiem", "KyHan", {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("LoaiTietKiem", "GhiChu", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("LoaiTietKiem", "KyHan", {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("LoaiTietKiem", "GhiChu", {
        type: Sequelize.STRING,
      }),
    ]);
  },
};
