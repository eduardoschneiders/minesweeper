Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace 'api' do
  	namespace 'v1' do
  		resources :users do
        collection do
          post 'signin'
        end

        member do
          resource :games
        end
      end
  	end
  end
end
