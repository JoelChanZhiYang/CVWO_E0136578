class CreateTags < ActiveRecord::Migration[6.0]
  def change
    create_table :tags do |t|
      t.string :name

      t.timestamps
    end

    create_table :tags_todos, id: false do |t|
      t.belongs_to :tag, index: true
      t.belongs_to :todo, index: true
    end
  end
end
