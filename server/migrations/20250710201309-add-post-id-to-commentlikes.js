'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CommentLikes', 'post_id', {
      type: Sequelize.UUID,
      references: {
        model: 'Posts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CommentLikes', 'post_id');
  }
};
