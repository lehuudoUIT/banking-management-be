module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("GiaoDich", "SoDu", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("GiaoDich", "SoDu", {
        allowNull: false,
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
