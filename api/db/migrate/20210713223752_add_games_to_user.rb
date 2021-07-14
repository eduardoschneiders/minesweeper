class AddGamesToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :games, :text
  end
end
