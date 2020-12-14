class Todo < ApplicationRecord
    validates :action, presence: true
    validates :completed, presence: true
end
