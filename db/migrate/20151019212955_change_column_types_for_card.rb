class ChangeColumnTypesForCard < ActiveRecord::Migration
  def up
  	change_column :cards, :super_type, :string, array: true
  	change_column :cards, :card_type, :string, null: false, array: true
  	change_column :cards, :sub_type, :string, array: true
  end

  def down
  	change_column :cards, :super_type, :string
  	change_column :cards, :card_type, :string, null: false
  	change_column :cards, :sub_type, :string
  end
end
