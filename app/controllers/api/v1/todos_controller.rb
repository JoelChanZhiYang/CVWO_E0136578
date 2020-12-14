class Api::V1::TodosController < ApplicationController
  def index
    todo = Todo.all
    render json: todo
  end

  def create
    todo = Todo.create!(todo_params)
    if todo
      render json: todo
    else
      render json: todo.errors
    end
  end

  def destroy
    find_todo.destory
    render json: {message: 'Deleted'}
  end

  private

  def todo_params
    params.permit(:action, :completed)
  end

  def find_todo
    @recipe = Recipe.find(params[:id])
  end
end
