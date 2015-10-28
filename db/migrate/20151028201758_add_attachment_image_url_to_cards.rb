class AddAttachmentImageUrlToCards < ActiveRecord::Migration
  def self.up
    change_table :cards do |t|
      t.attachment :image_url
    end
  end

  def self.down
    remove_attachment :cards, :image_url
  end
end
