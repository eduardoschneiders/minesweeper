module Api
	module V1
		class GamesController < ApplicationController
			def index
				render json: {users: User.all}, status: :ok
			end

      def create
        user = User.find(params[:id])

        user.games = params[:games].to_json

        if user.save
          render json: {}, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end
		end
	end
end
