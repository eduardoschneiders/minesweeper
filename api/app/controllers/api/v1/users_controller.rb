module Api
	module V1
		class UsersController < ApplicationController
			def index
				render json: {users: User.all}, status: :ok
			end

      def create
        user = User.new(params.permit(:username, :password))

        if user.save
          render json: user.to_json, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end

      def signin
        user  = User.find_by(username: params[:username], password: params[:password])

        if user
          render json: user.to_json, status: :ok
        else
          render json: {}, status: :not_found
        end
      end
		end
	end
end
