class Api::V1::ColorsController < ApplicationController
  def index
    color = Color.all
    render json: color
  end

  def find
    render json: find_color
  end

  private

  def find_color
    @color = Color.find(params[:color_id])
  end

  def color_params
    params.permit(:color_id, :used)
  end
end
