# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# 9.times do |i|
#     Todo.create(
#         task: "do work #{i}",
#         completed: false
#     )
# end

# 9.times do |i|
#     Todo.create(
#         task: "do work #{i+9}",
#         completed: true
#     )
# end

# 3.times do |i|
#     Tag.create(
#         name: "Category #{i}"
#     )
# end

store = ['e6194b', '3cb44b', 'ffe119', '4363d8', 'f58231', '911eb4', '46f0f0', 'f032e6', 'bcf60c', 'fabebe', '008080', 'e6beff', '9a6324', 
        'fffac8', '800000', 'aaffc3', '808000', 'ffd8b1', '000075', '808080']

Color.delete_all

store.each do |i|
    Color.create!(
        hex: "#{i}",
        used: false
    )
end