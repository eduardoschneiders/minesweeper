class User < ApplicationRecord
  validates :username, :password, presence: true
  serialize :status_changes, Array
end
