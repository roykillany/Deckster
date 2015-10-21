class RemoveCardColumns < ActiveRecord::Migration
  def change
  	remove_column :cards, :super_type
  	remove_column :cards, :card_type
  	remove_column :cards, :sub_type
  	remove_column :cards, :color
  end
end
