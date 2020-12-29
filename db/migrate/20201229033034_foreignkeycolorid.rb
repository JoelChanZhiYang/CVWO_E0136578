class Foreignkeycolorid < ActiveRecord::Migration[6.0]
  def change
    add_foreign_key :tags, :colors
  end
end
