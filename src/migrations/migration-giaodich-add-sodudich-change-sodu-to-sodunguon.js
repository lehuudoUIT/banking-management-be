module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("GiaoDich", "SoDuDich", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
      queryInterface.renameColumn("GiaoDich", "SoDu", "SoDuNguon"),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("GiaoDich", "SoDuDich"),
      queryInterface.renameColumn("GiaoDich", "SoDuNguon", "SoDu"),
    ]);
  },
};
