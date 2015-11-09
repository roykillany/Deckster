class CreateCollection < ActiveRecord::Migration
  def change
    create_table :collections do |t|
    	t.integer :profile_id, null: false

    	t.timestamps
    end
  end
end
