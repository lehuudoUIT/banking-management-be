module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("GiaoDich", "MaPhieu", {
        allowNull: true,
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("GiaoDich", "MaPhieu", {
        allowNull: false,
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
