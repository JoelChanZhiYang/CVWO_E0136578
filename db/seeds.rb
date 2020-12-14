# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

9.times do |i|
    Todo.create(
        task: "do work #{i}",
        completed: false
    )
end

9.times do |i|
    Todo.create(
        task: "do work #{i+9}",
        completed: true
    )
end