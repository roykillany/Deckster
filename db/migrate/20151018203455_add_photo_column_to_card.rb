class AddPhotoColumnToCard < ActiveRecord::Migration
  def change
  	add_column :cards, :image_url, :string, null: false, default: ""
  end
end
