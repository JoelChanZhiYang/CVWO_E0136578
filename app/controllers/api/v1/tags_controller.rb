class Api::V1::TagsController < ApplicationController
    def index
        tag = Tag.all
        hex = []
        tag.each do |i|
            hex.push(Color.find(i.color_id).hex)
        end
        render json: {tags: tag, colors:hex}
    end

    def create
        color = Color.where(:used => false).first
        tag_stuff = tag_params
        # todo = find_todo
        tag_stuff["color_id"] = color[:id]
        tag = Tag.create!(tag_stuff)
        color.update(used:true)
        find_todo.tags << tag
        if tag
            render json: {tag:tag, color: color}
        else
            render json: tag.errors
        end
    end

    def find_tags_of_todo
        tag = find_todo.tags
        hex = []
        tag.each do |i|
            hex.push(Color.find(i.color_id).hex)
        end

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

    def destroy
        tag = find_tag
        color = tag.color
        if tag
            tag.delete
            color.update(used:false)
            render json: {message: color}
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
