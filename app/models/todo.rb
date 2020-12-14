class Todo < ApplicationRecord
    validates :task, presence: true
end
