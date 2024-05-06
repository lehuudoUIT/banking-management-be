module.exports = {
  up: function (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn("GiaoDich", "MaPhieu", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn("GiaoDich", "MaPhieu");
  },
};
