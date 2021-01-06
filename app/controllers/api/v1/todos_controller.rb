class Api::V1::TodosController < ApplicationController
  def index
    todo = Todo.all
    tags = {}
    tagList = Tag.all
    hex = []
    todo.each do |i|
      tags[i.id] = i.tags
    end
    tagList.each do |i|
      hex.push(Color.find(i.color_id).hex)
    end

    render json: {todo:todo, tags:tags, tagList:tagList, hex:hex}
  end

  def create
    todo = Todo.create!(todo_params)
    tag = find_tag
    if todo
      if tag
        todo.tags << tag
      end
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

  def find_tag
    begin
        @tag = Tag.find(params[:tag_id])
    rescue
        false
    end
  end
end
