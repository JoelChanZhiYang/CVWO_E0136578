Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'todos/index'
      post 'todos/create'
      delete 'todos/destroy/:id', to: 'todos#destroy'
      put 'todos/update/:id', to: 'todos#update'

      get 'tags/index'
      post 'tags/create'
      get 'tags/find/:todo_id', to: 'tags#find_tags_of_todo'
      post 'tags/link/', to: 'tags#create_tags_for_todo'
      delete 'tags/destroyLink/', to: 'tags#destroy_link'
    end
  end
  root 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
