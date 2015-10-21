class ChangePowerToughnessTypeForCards < ActiveRecord::Migration
  def up
  	change_column :cards, :power, :string
  	change_column :cards, :toughness, :string
  end

  def down
  	change_column :cards, :power, :integer
  	change_column :cards, :toughness, :integer
  end
end
