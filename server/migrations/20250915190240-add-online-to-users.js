'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('userMaldens', 'online', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // по подразбиране офлайн
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('userMaldens', 'online');
  }
};
