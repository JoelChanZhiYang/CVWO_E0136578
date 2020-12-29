class AddColoridToTags < ActiveRecord::Migration[6.0]
  def change
    add_column :tags, :color_id, :int
  end
end
