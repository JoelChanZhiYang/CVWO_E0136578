class Api::V1::TagsController < ApplicationController
    def index
        tag = Tag.all
        render json: tag
    end

    def create
        tag = Tag.create!(tag_params)
        if tag
            render json: tag
        else
            render json: tag.errors
        end
    end

    def find_tags_of_todo
        # tag = Todo.includes(:tags).find(params[:todo_id]).tags
        tag = find_todo.tags
        render json: tag
    end

    def create_tags_for_todo
        todo = find_todo
        tag = find_tag

        if todo && tag
            todo.tags << tag
            render json: {todo: todo,
                          tag: tag}
        else
            render json: {message: "Unsuccessful"}
        end
    end

    def destroy_link
        todo = find_todo
        tag = find_tag

        if todo && tag
            todo.tags.delete(tag)
            render json: {todo: todo,
                          tag: tag}
        else
            render json: {message: "Unsuccessful"}
        end
    end

    private

    def tag_params
        params.permit(:name)
    end

    def find_todo
        begin
            @todo = Todo.find(params[:todo_id])
        rescue
            false
        end
    end

    def find_tag
        begin
            @tag = Tag.find(params[:tag_id])
        rescue
            false
        end
    end
end
