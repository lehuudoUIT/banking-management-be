module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("PhieuTietKiem", "MaNhanVien"),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("PhieuTietKiem", "MaNhanVien", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
