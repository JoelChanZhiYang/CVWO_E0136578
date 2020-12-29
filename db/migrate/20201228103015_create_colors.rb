class CreateColors < ActiveRecord::Migration[6.0]
  def change
    create_table :colors do |t|
      t.string :hex
      t.boolean :used

      t.timestamps
    end
  end
end
