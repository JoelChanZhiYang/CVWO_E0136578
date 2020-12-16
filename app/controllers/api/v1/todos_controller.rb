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
    find_todo.destroy
    render json: {message: 'Deleted'}
  end

  def update
    todo = find_todo
    todo.update(todo_params)
    render json: todo
  end

  private

  def todo_params
    params.permit(:task, :completed)
  end

  def find_todo
    @todo = Todo.find(params[:id])
  end
end
