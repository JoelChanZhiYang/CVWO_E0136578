Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'todos/index'
      post 'todos/create'
      delete 'todos/destroy/:id', to: 'todos#destroy'
      put 'todos/update/:id', to: 'todos#update'
    end
  end
  root 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
